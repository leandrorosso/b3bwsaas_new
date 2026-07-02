"use server";

import { cookies } from "next/headers";
import { hash, compare } from "bcryptjs";
import type { User } from "./types";
import prisma from "../prisma";

function generateToken(): string {
	const arr = new Uint8Array(12);
	globalThis.crypto.getRandomValues(arr);
	return Array.from(arr, (v) => v.toString(16).padStart(2, "0")).join("");
}

export interface SignUpParams {
	firstName: string;
	lastName: string;
	email: string;
	emailVerified: string;
	address?: string | null;
	phone?: string | null;
	password: string;
}
export interface SignInWithOAuthParams {
	provider: "google" | "discord";
}

export interface SignInWithPasswordParams {
	email: string;
	password: string;
}

export interface ResetPasswordParams {
	email: string;
}

export async function signUp(_: SignUpParams): Promise<{ data?: { user: User }; error?: string }> {
	// Store the user in the database

	const userAlreadyExists =  await prisma.user.findFirst({
		where:{
			email: _.email,
		}
	})

	if(userAlreadyExists){
		throw new Error("Usuário já existe !!!")
	}

    // Criptografar a senha
    const passwordHash = await hash(_.password, 8)

	try {
		const usercreated = await prisma.user.create({
		data:{
			name: `${_.firstName} ${_.lastName}`,
			firstname: _.firstName,
			lastname: _.lastName,	
			email: _.email,
			emailVerified: _.emailVerified,
			address: _.address,
			phone: _.phone,	
			status: true,
			inactive: false,
			password: passwordHash,
		},
		})

		const token = generateToken();

		await prisma.session.create({
		data: {
			sessionToken: token,
			userId: usercreated.id,
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		},
		});

		const cookieStore = await cookies();
		cookieStore.set("access_token", token,{
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
		});

		return { 
			data: { user: { id: usercreated.id, 
							 email: usercreated.email, 
							 name: usercreated.name, 
							 firstname: usercreated.firstname, 
							 lastname: usercreated.lastname, 
							 address: usercreated.address, 
							 phone: usercreated.phone, 
							 status: usercreated.status, 
							 inactive: usercreated.inactive, 
							 created_at: usercreated.created_at, 
							 updated_at: usercreated.updated_at, 
							 stripe_customer_id: usercreated.stripe_customer_id, 
							 emailVerified: '', 
							 image: usercreated.image  } }
		}
	} catch (error) {
		return { error: "Error ao criar usuário" }
	};
}

export async function signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
	return { error: "Social authentication not implemented" };
}

export async function signInWithPassword(
	params: SignInWithPasswordParams
): Promise<{ data?: { user: User }; error?: string }> {
	const { email, password } = params;

	const userValidate = await prisma.user.findFirst({
		where:{
			email: email
		}
	})

	if(!userValidate){
		return { error: "Invalid credentials" }
	}

	const passwordMatch = await compare(password, userValidate.password)

	if(!passwordMatch){
		return { error: "Invalid credentials" }
	}
		
	const token = generateToken();

	await prisma.session.create({
	data: {
		sessionToken: token,
		userId: userValidate.id,
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
	},
	});

	const cookieStore = await cookies();
	cookieStore.set("access_token", token,{
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
	});

	return { data: { user: { id: userValidate.id, 
							 email: userValidate.email, 
							 name: userValidate.name, 
							 firstname: userValidate.firstname, 
							 lastname: userValidate.lastname, 
							 address: userValidate.address, 
							 phone: userValidate.phone, 
							 status: userValidate.status, 
							 inactive: userValidate.inactive, 
							 created_at: userValidate.created_at, 
							 updated_at: userValidate.updated_at, 
							 stripe_customer_id: userValidate.stripe_customer_id, 
							 emailVerified: '', 
							 image: userValidate.image } 
					} 
			};
}

export async function resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
	return { error: "Password reset not implemented" };
}

export async function updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
	return { error: "Update reset not implemented" };
}

export async function signOut(): Promise<{ error?: string }> {
	const cookieStore = await cookies();
	const token = cookieStore.get("access_token")?.value;

	const session = await prisma.session.delete({
		where: {
			sessionToken: token,
		}
  	});

	cookieStore.delete("access_token");

	return {};
}
