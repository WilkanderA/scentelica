import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, brandId, year, gender, concentration, description, bottleImageUrl, notes } = body;

    // Create fragrance
    const fragrance = await prisma.fragrance.create({
      data: {
        name,
        brandId,
        year: year || null,
        gender: gender || null,
        concentration: concentration || null,
        description: description || null,
        bottleImageUrl: bottleImageUrl || null,
      },
    });

    // Add notes if provided
    if (notes && notes.length > 0) {
      await prisma.fragranceNote.createMany({
        data: notes.map((note: { noteId: string; category: string; intensity?: number }) => ({
          fragranceId: fragrance.id,
          noteId: note.noteId,
          category: note.category,
          intensity: note.intensity || null,
        })),
      });
    }

    return NextResponse.json(fragrance, { status: 201 });
  } catch (error) {
    console.error("Error creating fragrance:", error);
    return NextResponse.json(
      { error: "Failed to create fragrance" },
      { status: 500 }
    );
  }
}
