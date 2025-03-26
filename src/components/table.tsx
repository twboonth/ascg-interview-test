"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
type RentalContract = {
  id: number;
  customerName: string;
  startDate: string;
  endDate: string;
};

type vehicle = {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  rentalContract: RentalContract | null;
};

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
};

export default function Table() {
  const [vehicle, setVehicle] = useState<vehicle[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const fetchCars = async (page = 1) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      searchParams.set("page", page.toString());
      searchParams.set("limit", meta.limit.toString());

      if (customerName) searchParams.set("customerName", customerName);
      if (startDate)
        searchParams.set("startDate", startDate.toISOString().split("T")[0]);
      if (endDate)
        searchParams.set("endDate", endDate.toISOString().split("T")[0]);

      const response = await fetch(`http://localhost:4000/api/rental?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      setVehicle(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSearch = () => {
    fetchCars(1);
  };

  const handleReset = () => {
    setCustomerName("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  useEffect(() => {
    if (!customerName && !startDate && !endDate) {
      fetchCars(1);
    }
  }, [customerName, startDate, endDate]);

  const handlePageChange = (newPage: number) => {
    fetchCars(newPage);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: th });
    } catch (e) {
      return dateString;
    }
  };
  const mockCustomers: any = [
    {
      id: 1,
      licensePlate: "กท-1234",
      brand: "Toyota",
      model: "Fortuner",
      rentalContract: {
        id: 101,
        customerName: "สมพงษ์  สมศรี",
        startDate: "2025-03-01",
        endDate: "2025-09-01",
      },
    },
    {
      id: 2,
      licensePlate: "กจ-5678",
      brand: "Honda",
      model: "Civic",
      rentalContract: {
        id: 102,
        customerName: "Jane Smith",
        startDate: "2024-05-15",
        endDate: "2024-11-15",
      },
    },
  ];

  return (
    <>
      <div className="w-full mt-4 md:mt-8">
        <h1 className={` mb-8 text-xl md:text-2xl`}>Rental</h1>
        {/* <Search placeholder="Search customers..." /> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="customerName" className="text-sm font-medium">
              ชื่อลูกค้า
            </label>
            <input
              id="customerName"
              placeholder="ชื่อลูกค้า"
              value={customerName}
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              วันที่เริ่มเช่า
            </label>
            <input
              type="date"
              id="startDate"
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              value={startDate ? startDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              id="endDate"
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          <button
            className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={handleReset}
          >
            ล้างข้อมูล
          </button>
          <button
            className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={handleSearch}
          >
            ค้นหา
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                <div className="md:hidden">
                  {vehicle?.map((customer: any) => (
                    <div
                      key={customer.id}
                      className="mb-2 w-full rounded-md bg-white p-4"
                    >
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <div className="mb-2 flex items-center">
                            <div className="flex items-center gap-3">
                              <p>{customer.name}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-between border-b py-5">
                        <div className="flex w-1/2 flex-col">
                          <p className="text-xs">Pending</p>
                          <p className="font-medium">
                            {customer.total_pending}
                          </p>
                        </div>
                        <div className="flex w-1/2 flex-col">
                          <p className="text-xs">Paid</p>
                          <p className="font-medium">{customer.total_paid}</p>
                        </div>
                      </div>
                      <div className="pt-4 text-sm">
                        <p>{customer.total_invoices} invoices</p>
                      </div>
                    </div>
                  ))}
                </div>
                <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                  <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                    <tr>
                      <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                        ป้ายทะเบียน
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        ยี่ห้อ
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        รุ่น
                      </th>
                      <th scope="col" className="px-3 py-5 font-medium">
                        ชื่อผู้เช่า
                      </th>
                      <th scope="col" className="px-4 py-5 font-medium">
                        วันที่เริ่มสัญญา
                      </th>
                      <th scope="col" className="px-4 py-5 font-medium">
                        วันที่สิ้นสุดสัญญา
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-gray-900">
                    {vehicle.map((customer: any) => (
                      <tr key={customer.id} className="group">
                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                          <div className="flex items-center gap-3">
                            <p>{customer.licensePlate}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                          {customer.brand}
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                          {customer.model}
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                          {customer.rentalContract?.customerName
                            ? customer.rentalContract?.customerName
                            : "ไม่มีสัญญาเช่า"}
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                          {customer.rentalContract?.startDate
                            ? customer.rentalContract?.startDate
                            : "ไม่มีสัญญาเช่า"}
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                          {customer.rentalContract?.endDate
                            ? customer.rentalContract?.endDate
                            : "ไม่มีสัญญาเช่า"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                หน้า {meta.currentPage} จาก {meta.totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="btn btn-outline btn-icon"
                  onClick={() => handlePageChange(meta.currentPage - 1)}
                  disabled={meta.currentPage === 1 || loading}
                >
                  {"<"}
                </button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, meta.totalPages) },
                    (_, i) => {
                    
                      let pageNum = i + 1;
                      if (meta.totalPages > 5) {
                        if (meta.currentPage > 3) {
                          pageNum = meta.currentPage - 3 + i;
                        }
                        if (meta.currentPage > meta.totalPages - 2) {
                          pageNum = meta.totalPages - 4 + i;
                        }
                      }

                      return pageNum <= meta.totalPages ? (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          
                          className={`w-8 h-8 ${
                    pageNum === meta.currentPage ? "bg-amber-100" : ""}`}
                        >
                          {pageNum}
                        </button>
                      ) : null;
                    }
                  )}
                </div>
                <button
                  className={`btn btn-outline btn-icon `}
                  onClick={() => handlePageChange(meta.currentPage + 1)}
                  disabled={meta.currentPage === meta.totalPages || loading}

                >
                  {">"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
