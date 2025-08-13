import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({
    name: 'posts',
})
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    title: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    content: string;

    @Column({ type: 'varchar', length: 255, name: 'cover_image', nullable: true })
    coverImage: string;

    @Column({ type: 'varchar', length: 255, name: 'summary', nullable: true })
    summary: string;

    @Column({ type: 'boolean', default: true, name: 'is_draft' })
    isDraf: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.posts, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
