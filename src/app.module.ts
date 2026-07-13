import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ContactsModule } from './modules/contacts/contacts.modue';
import { CompaniesModule } from './modules/companies/companies.module';
import { LeadsModule } from './modules/leads/leads.module';
import { DealsModule } from './modules/deals/deals.module';
import { PipelineModule } from './modules/pipeline/pipeline.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,AuthModule,UsersModule,TeamsModule,
    ContactsModule,CompaniesModule,LeadsModule,
    DealsModule,PipelineModule,ActivitiesModule,TasksModule
  ],
})
export class AppModule {}