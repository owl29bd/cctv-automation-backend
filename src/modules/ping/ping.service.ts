import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as ping from 'ping';
import { CameraStatus } from 'src/enums/camera-status.enum';
import { CameraService } from '../camera/camera.service';
import { IMessage } from '../socket/message.dto';
import { SocketService } from '../socket/socket.service';

export interface PingResult {
  cameraId: string;
  ip: string;
  success: boolean;
  latency?: number;
  error?: string;
  timestamp: Date;
}

export interface StatusChange {
  cameraId: string;
  previousStatus: string;
  newStatus: string;
}

@Injectable()
export class PingService {
  private readonly logger = new Logger(PingService.name);
  private readonly pingTimeout = 3000; // 10 seconds timeout

  constructor(
    private readonly cameraService: CameraService,
    private readonly socketService: SocketService,
  ) {}

  /**
   * Ping a single host
   */
  async pingHost(ip: string): Promise<Partial<PingResult>> {
    const timestamp = new Date();

    try {
      const result = await ping.promise.probe(ip, {
        timeout: this.pingTimeout / 1000, // ping package uses seconds
      });

      const pingResult: Partial<PingResult> = {
        ip,
        success: result.alive,
        timestamp,
      };

      if (result.alive && result.time) {
        const timeValue =
          typeof result.time === 'string'
            ? parseFloat(result.time)
            : result.time;
        if (!isNaN(timeValue) && isFinite(timeValue)) {
          pingResult.latency = timeValue;
          this.logger.log(`✓ ${ip} - Success (${pingResult.latency}ms)`);
        }
      } else {
        pingResult.success = false;
        pingResult.error = 'Host unreachable or timeout';
        this.logger.warn(`✗ ${ip} - Failed: ${pingResult.error}`);
      }

      // console.log('pingResult', pingResult);

      return pingResult;
    } catch (error) {
      const pingResult: Partial<PingResult> = {
        ip,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp,
      };

      this.logger.error(`✗ ${ip} - Error: ${pingResult.error}`);

      console.log('pingResult', pingResult);
      return pingResult;
    }
  }

  /**
   * Ping all cameras sequentially
   */
  async pingAllCameras(): Promise<{
    pingResults: PingResult[];
    statusChanges: StatusChange[];
  }> {
    const results: PingResult[] = [];
    const changes: StatusChange[] = [];

    const cameras = await this.cameraService.getAllCameraIdsAndIps();
    console.log('Cameras to ping:', cameras);
    if (cameras.length === 0) {
      this.logger.warn('No cameras found in the database to ping.');
      return { pingResults: results, statusChanges: changes };
    }

    this.logger.log(`Starting to ping ${cameras.length} camera(s)...`);

    for (const { ip, id, status } of cameras) {
      try {
        const result = await this.pingHost(ip);
        // result.cameraId = id;
        const pingResult: PingResult = {
          cameraId: id,
          ip: result.ip,
          success: result.success,
          latency: result.latency,
          error: result.error,
          timestamp: result.timestamp,
        };
        results.push(pingResult);
        // store camera status and pingresult.success missmatches
        const previousStatus = status;
        if (previousStatus === CameraStatus.Online && !pingResult.success) {
          changes.push({
            cameraId: id,
            previousStatus,
            newStatus: CameraStatus.Offline,
          });
        } else if (
          (previousStatus === CameraStatus.Offline ||
            previousStatus === CameraStatus.Dead ||
            previousStatus === CameraStatus.Lost) &&
          pingResult.success
        ) {
          changes.push({
            cameraId: id,
            previousStatus,
            newStatus: CameraStatus.Online,
          });
        }
      } catch (error) {
        // Continue pinging other cameras even if one fails
        const errorResult: PingResult = {
          cameraId: id,
          ip,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
        };
        results.push(errorResult);
        this.logger.error(`Failed to ping ${ip}: ${errorResult.error}`);
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    this.logger.log(
      `Ping completed: ${successCount} successful, ${failureCount} failed out of ${results.length} total`,
    );

    return { pingResults: results, statusChanges: changes };
  }

  /**
   * Scheduled cron job to ping all cameras every 2 minutes
   * Cron expression: every 2 minutes (0, 2, 4, 6, 8, 10, ... minutes past the hour)
   */
  @Cron('*/2 * * * *')
  async handleCron() {
    this.logger.log('Running scheduled ping job...');
    const pingResultsWithstatusChanges = await this.pingAllCameras();

    // store pingResultsWithstatusChanges.statusChanges in the database
    await this.cameraService.updateCameraStatuses(
      pingResultsWithstatusChanges.statusChanges,
    );
    // test: send socket message to all connected clients
    const iMessage: IMessage = {
      type: 'pingResults',
      content: pingResultsWithstatusChanges.statusChanges,
      timestamp: new Date(),
    };
    this.socketService.broadcast(iMessage);
  }
}
