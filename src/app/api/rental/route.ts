import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const customerName = searchParams.get("customerName") || ""
    const startDate = searchParams.get("startDate") || ""
    const endDate = searchParams.get("endDate") || ""

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (customerName || startDate || endDate) {
      where.rentalContract = {}

      if (customerName) {
        where.rentalContract.customerName = {
          contains: customerName,
        //   mode: "insensitive",
        }
      }

      if (startDate) {
        where.rentalContract.startDate = {
          gte: new Date(startDate),
        }
      }

      if (endDate) {
        where.rentalContract.endDate = {
          lte: new Date(endDate),
        }
      }
    }
    const cars = await prisma.vehicle.findMany({
      where,
      include: {
        rentalContract: true,
      },
      skip,
      take: limit,
      orderBy: {
        id: "asc",
      },
    })

    // Get total count for pagination
    const totalCount = await prisma.vehicle.count({ where })
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      data: cars,
      meta: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { licensePlate, brand, model, rentalContract } = body

    // Create car with nested rental contract
    const car = await prisma.vehicle.create({
      data: {
        licensePlate,
        brand,
        model,
        rentalContract: rentalContract
          ? {
              create: {
                customerName: rentalContract.customerName,
                startDate: new Date(rentalContract.startDate),
                endDate: new Date(rentalContract.endDate),
              },
            }
          : undefined,
      },
      include: {
        rentalContract: true,
      },
    })

    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    console.error("Error creating car:", error)
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 })
  }
}

