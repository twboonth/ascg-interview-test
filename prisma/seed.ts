import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // ลบข้อมูลเดิมทั้งหมด (ถ้ามี)
  await prisma.rentalContract.deleteMany({})
  await prisma.vehicle.deleteMany({})

  console.log("🗑️ ลบข้อมูลเดิมเรียบร้อยแล้ว")

  // สร้างข้อมูลรถและสัญญาเช่า
  const carsData = [
    {
      licensePlate: "กท-1234",
      brand: "Toyota",
      model: "Fortuner",
      rentalContract: {
        create: {
          customerName: "สมพงษ์ สมศรี",
          startDate: new Date("2025-03-01"),
          endDate: new Date("2025-09-01"),
        },
      },
    },
    {
      licensePlate: "กจ-5678",
      brand: "Honda",
      model: "Civic",
      rentalContract: {
        create: {
          customerName: "Jane Smith",
          startDate: new Date("2024-05-15"),
          endDate: new Date("2024-11-15"),
        },
      },
    },
    {
      licensePlate: "ขก-9012",
      brand: "Nissan",
      model: "Almera",
      rentalContract: {
        create: {
          customerName: "วิชัย มั่งมี",
          startDate: new Date("2024-04-10"),
          endDate: new Date("2024-10-10"),
        },
      },
    },
    {
      licensePlate: "ฉก-3456",
      brand: "Mazda",
      model: "CX-5",
      rentalContract: {
        create: {
          customerName: "สมศรี ใจดี",
          startDate: new Date("2024-06-20"),
          endDate: new Date("2024-12-20"),
        },
      },
    },
    {
      licensePlate: "กพ-7890",
      brand: "Mitsubishi",
      model: "Pajero",
      rentalContract: {
        create: {
          customerName: "John Doe",
          startDate: new Date("2024-07-05"),
          endDate: new Date("2025-01-05"),
        },
      },
    },
    {
      licensePlate: "ชม-1122",
      brand: "Isuzu",
      model: "D-Max",
      rentalContract: {
        create: {
          customerName: "ประเสริฐ รักดี",
          startDate: new Date("2024-08-15"),
          endDate: new Date("2025-02-15"),
        },
      },
    },
    {
      licensePlate: "ขอ-3344",
      brand: "Ford",
      model: "Ranger",
      rentalContract: {
        create: {
          customerName: "มานี มีทรัพย์",
          startDate: new Date("2024-09-01"),
          endDate: new Date("2025-03-01"),
        },
      },
    },
    {
      licensePlate: "กด-5566",
      brand: "MG",
      model: "ZS",
      rentalContract: {
        create: {
          customerName: "Sarah Johnson",
          startDate: new Date("2024-10-10"),
          endDate: new Date("2025-04-10"),
        },
      },
    },
    {
      licensePlate: "ฉช-7788",
      brand: "Suzuki",
      model: "Swift",
      rentalContract: {
        create: {
          customerName: "พิมพ์ใจ สุขสันต์",
          startDate: new Date("2024-11-15"),
          endDate: new Date("2025-05-15"),
        },
      },
    },
    {
      licensePlate: "กค-9900",
      brand: "Honda",
      model: "City",
      rentalContract: {
        create: {
          customerName: "ธนา รุ่งเรือง",
          startDate: new Date("2024-12-01"),
          endDate: new Date("2025-06-01"),
        },
      },
    },
    // รถที่ยังไม่มีสัญญาเช่า
    {
      licensePlate: "กว-1357",
      brand: "Toyota",
      model: "Camry",
    },
    {
      licensePlate: "ขง-2468",
      brand: "Honda",
      model: "Accord",
    },
  ]

  for (const carData of carsData) {
    await prisma.vehicle.create({
      data: carData,
    })
  }

  console.log("🚗 เพิ่มข้อมูลรถและสัญญาเช่าเรียบร้อยแล้ว")

  const carsCount = await prisma.vehicle.count()
  const contractsCount = await prisma.rentalContract.count()

  console.log(`📊 สถิติ: มีรถทั้งหมด ${carsCount} คัน, มีสัญญาเช่าทั้งหมด ${contractsCount} สัญญา`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

