import { IsInt } from 'class-validator';

export class CheckoutDto {
  @IsInt()
  checkin_id: number;
}
