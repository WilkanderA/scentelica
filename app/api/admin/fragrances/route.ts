import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, brandId, year, gender, concentration, description, bottleImageUrl, notes, customNotes, newBrandName } = body;

    // Handle new brand creation if newBrandName is provided
    let finalBrandId = brandId;
    if (newBrandName && newBrandName.trim()) {
      const brand = await prisma.brand.upsert({
        where: { name: newBrandName.trim() },
        update: {},
        create: { name: newBrandName.trim() },
      });
      finalBrandId = brand.id;
    }

    // Create fragrance
    const fragrance = await prisma.fragrance.create({
      data: {
        name,
        brandId: finalBrandId,
        year: year || null,
        gender: gender || null,
        concentration: concentration || null,
        description: description || null,
        bottleImageUrl: bottleImageUrl || null,
      },
    });

    // Handle custom notes - create or find existing notes
    if (customNotes && customNotes.length > 0) {
      for (const customNote of customNotes) {
        // Try to find existing note or create new one
        const note = await prisma.note.upsert({
          where: { name: customNote.name },
          update: {},
          create: {
            name: customNote.name,
            category: customNote.category,
          },
        });

        // Link note to fragrance
        await prisma.fragranceNote.create({
          data: {
            fragranceId: fragrance.id,
            noteId: note.id,
            category: customNote.category,
            intensity: 3, // Default intensity
          },
        });
      }
    }

    // Add notes if provided (legacy support for existing note IDs)
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
