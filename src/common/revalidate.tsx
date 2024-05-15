'use server';

import { revalidatePath } from 'next/cache';

export const revalidateRootLayout = async () => {
	revalidatePath('/', 'layout');
};

export const revalidateProjectLayout = async () => {
	revalidatePath('/projects', 'layout');
};
