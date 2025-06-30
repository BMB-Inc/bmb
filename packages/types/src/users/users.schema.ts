import z from 'zod/v4';


export const user = z.object({
    avatarColor: z.string().optional().nullable(),
    createdAt: z.date().optional().nullable(),
    staffCode: z.string().optional().nullable(),
    email: z.email(),
    id: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    phoneExt: z.string().optional().nullable(),
    phoneNumber: z.string().optional().nullable(),
    role: z.enum(['ADMIN', 'USER']),
    updatedAt: z.date().optional().nullable()
});

export type User = z.infer<typeof user>;

export interface UsersDB {
    User: User;
}
