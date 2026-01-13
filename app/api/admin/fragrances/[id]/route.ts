import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Update fragrance
    const fragrance = await prisma.fragrance.update({
      where: { id },
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

    // Delete existing notes and recreate
    await prisma.fragranceNote.deleteMany({
      where: { fragranceId: id },
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
            fragranceId: id,
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
          fragranceId: id,
          noteId: note.noteId,
          category: note.category,
          intensity: note.intensity || null,
        })),
      });
    }

    return NextResponse.json(fragrance);
  } catch (error) {
    console.error("Error updating fragrance:", error);
    return NextResponse.json(
      { error: "Failed to update fragrance" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.fragrance.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting fragrance:", error);
    return NextResponse.json(
      { error: "Failed to delete fragrance" },
      { status: 500 }
    );
  }
}
