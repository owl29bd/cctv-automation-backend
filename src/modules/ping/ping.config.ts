/**
 * IP Camera Addresses Configuration
 *
 * Add your IP camera addresses here, or set them via environment variable IP_CAMERAS
 * Environment variable format: IP_CAMERAS=192.168.1.100,192.168.1.101,192.168.1.102
 */
export const IP_CAMERAS: string[] = process.env.IP_CAMERAS
  ? process.env.IP_CAMERAS.split(',')
      .map((ip) => ip.trim())
      .filter((ip) => ip.length > 0)
  : [
      // Add your IP camera addresses here
      // Example:
      '192.168.0.105',
      '192.168.0.104',
      '192.168.0.100',
      '192.168.0.101',
    ];
