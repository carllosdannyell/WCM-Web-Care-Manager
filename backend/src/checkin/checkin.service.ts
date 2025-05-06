import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Checkin } from './checkin.entity';
import { Repository } from 'typeorm';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { Patient } from '../patient/patient.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(Checkin)
    private readonly checkinRepo: Repository<Checkin>,

    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateCheckinDto): Promise<Checkin> {
    const patient = await this.patientRepo.findOneBy({ id: dto.patient_id });
    if (!patient) throw new NotFoundException('Paciente não encontrado');

    const user = await this.userRepo.findOneBy({ id: dto.user_id });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const checkin = this.checkinRepo.create({
      patient,
      user,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });

    return this.checkinRepo.save(checkin);
  }

  async checkout(dto: CheckoutDto): Promise<Checkin> {
    const checkin = await this.checkinRepo.findOne({
      where: { id: dto.checkin_id },
      relations: ['patient', 'user'],
    });
    if (!checkin) throw new NotFoundException('Check-in não encontrado');

    checkin.check_out_at = new Date();
    await this.checkinRepo.save(checkin);
    return checkin;
  }

  findAll(): Promise<Checkin[]> {
    return this.checkinRepo.find({ relations: ['patient', 'user'] });
  }

  findByUser(userId: number): Promise<Checkin[]> {
    return this.checkinRepo.find({
      where: { user: { id: userId } },
      relations: ['patient'],
    });
  }

  findByPatient(patientId: number): Promise<Checkin[]> {
    return this.checkinRepo.find({
      where: { patient: { id: patientId } },
      relations: ['user'],
    });
  }
}
