import { Expose, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.res';
import { WeekDay } from 'src/enums/day.enum';

class ScheduleSlotResponse {
  @ApiProperty({ type: Date })
  @Expose()
  startAt: Date;

  @ApiProperty({ type: Date })
  @Expose()
  endAt: Date;
}

class ScheduleTimeSlotResponse {
  @ApiProperty()
  @Expose()
  start: string;

  @ApiProperty()
  @Expose()
  end: string;
}

class WeeklyRecurrenceResponse {
  @ApiProperty({
    example: WeekDay.Monday,
    enum: WeekDay,
  })
  @Expose()
  day: WeekDay;

  @ApiProperty({ type: [ScheduleTimeSlotResponse], isArray: true })
  @Expose()
  @Type(() => ScheduleTimeSlotResponse)
  timeSlots: ScheduleTimeSlotResponse[];
}

export class ScheduleResponse extends BaseResponse {
  @ApiProperty({ type: ScheduleResponse })
  @Expose()
  @Type(() => ScheduleSlotResponse)
  bookedSlots: ScheduleSlotResponse[];

  @ApiProperty({ type: [WeeklyRecurrenceResponse], isArray: true })
  @Expose()
  @Type(() => WeeklyRecurrenceResponse)
  weeklyUnavailability: WeeklyRecurrenceResponse[];
}
