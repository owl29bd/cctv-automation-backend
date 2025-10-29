import { Injectable, PipeTransform } from '@nestjs/common';
import {
  PaginationQueryDto,
  PaginationQueryOptions,
} from 'src/dtos/requests/query.dto';

@Injectable()
export class QueryTransformPipe implements PipeTransform {
  async transform(query: PaginationQueryOptions): Promise<PaginationQueryDto> {
    const page = this.transformPage(query.page);
    const limit = this.transformLimit(query.limit);
    const sortBy = this.transformSortBy(query.sortBy);
    const filter = this.transformFilter(query.filter);
    const search = query.search;

    return {
      page,
      limit,
      sortBy,
      filter,
      search,
    };
  }

  private transformSortBy(sortBy?: string | string[]) {
    if (!sortBy) {
      return { createdAt: -1 };
    }

    if (typeof sortBy === 'string') {
      sortBy = [sortBy];
    }

    return sortBy.reduce((acc, curr) => {
      const [key, value] = curr.split(':');
      return { ...acc, [key]: value === 'desc' ? -1 : 1 };
    }, {});
  }

  private transformFilter(filter: string | string[]) {
    if (!filter) return {};

    if (typeof filter === 'string') {
      filter = [filter];
    }
    return filter.reduce((acc, curr) => {
      // split by first colon
      const firstColonIndex = curr.indexOf(':');
      const key = curr.substring(0, firstColonIndex);
      const value = curr.substring(firstColonIndex + 1);

      // if number
      if (!isNaN(Number(value))) {
        return { ...acc, [key]: Number(value) };
      }

      // if boolean
      if (value === 'true' || value === 'false') {
        return { ...acc, [key]: value === 'true' };
      }

      // if date
      if (Date.parse(value)) {
        return { ...acc, [key]: new Date(value) };
      }

      // if string
      return { ...acc, [key]: { $regex: value, $options: 'i' } };
    }, {});
  }

  private transformPage(page: number) {
    return page && parseInt(page.toString(), 10) > 0
      ? parseInt(page.toString(), 10)
      : 1;
  }

  private transformLimit(limit: number) {
    return limit && parseInt(limit.toString(), 10) > 0
      ? parseInt(limit.toString(), 10)
      : 10;
  }
}
