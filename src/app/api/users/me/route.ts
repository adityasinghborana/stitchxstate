import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma'; // Adjust import for your Prisma setup
import { userResponseDto } from '@/core/dtos/User.dto'; // Adjust import


export async function GET(request: NextRequest) {
  try {
    // Get the token cookie using request.cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      isAdmin: boolean;
    };

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        isAdmin: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    // Map to userResponseDto
    const userResponse: userResponseDto = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.isAdmin,
      phone: user.phone ?? undefined,
    };

    return NextResponse.json({ user: userResponse, token }, { status: 200 });
  } catch (error) {
    console.error('Error verifying token:', error);
    // Be specific with the error message based on the type of error
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}