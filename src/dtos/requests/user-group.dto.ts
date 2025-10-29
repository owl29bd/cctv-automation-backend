import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsMongoId,
  ValidateIf,
} from 'class-validator';
import { GroupType } from 'src/enums/group-type.enum';

export class UserGroupDto {
  @ApiProperty({
    example: 'Analyst Group',
  })
  @IsDefined({ message: 'Group name is required' })
  groupName: string;

  @ApiProperty({
    example: GroupType.Analyst,
  })
  @IsDefined({ message: 'Group type is required' })
  groupType: GroupType;

  @ApiProperty()
  @ValidateIf((o) => !o.groupLeader)
  @IsDefined({ message: 'Group leader ID is required' })
  @IsMongoId({ message: 'Invalid group leader ID' })
  groupLeader: string;

  @ApiProperty()
  @ValidateIf((o) => !o.groupMembers)
  @IsArray()
  @ArrayMinSize(1, { message: 'Group members are required' })
  groupMembers: string[];
}
