// import {
//     Entity,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//     DeleteDateColumn,
// } from 'typeorm';

// @Entity('sample')
// export default class SampleEntity {
//     @PrimaryGeneratedColumn()
//     id!: number;

//     @Column({ type: 'varchar', length: 255, nullable: true })
//     name?: string;

//     @Column({ type: 'text', nullable: true })
//     description?: string;

//     @CreateDateColumn({ type: 'datetime', nullable: true })
//     createdAt?: Date | null;

//     @UpdateDateColumn({ type: 'datetime', nullable: true })
//     updatedAt?: Date | null;

//     @DeleteDateColumn({ type: 'datetime', nullable: true })
//     deletedAt?: Date | null;
// }
