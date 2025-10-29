import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { Types } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  async transform(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    return id;
  }
}
