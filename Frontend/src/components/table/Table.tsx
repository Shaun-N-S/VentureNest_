// import React, { useState } from "react";

// export interface TableData {
//     id: number;
//     name: string;
//     email: string;
//     profileImg?: string;
//     userId: number;
//     projects: number;
//     status: "active" | "inactive" | "blocked";
// }

// interface ReusableTableProps {
//     data: TableData[];
//     onStatusChange: (id: number) => void;
// }

// const ReusableTable: React.FC<ReusableTableProps> = ({ data, onStatusChange }) => {
//     const [search, setSearch] = useState("");

//     const filteredData = data.filter(
//         (item) =>
//             item.name.toLowerCase().includes(search.toLowerCase()) ||
//             item.email.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
//             {/* Search Bar */}
//             <div className="flex justify-between items-center mb-4">
//                 <input
//                     type="text"
//                     placeholder="Search Users"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="px-4 py-2 border rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 />
//                 <button className="ml-2 text-indigo-600 font-medium flex items-center gap-1">
//                     Filter
//                     <span>🔽</span>
//                 </button>
//             </div>

//             <table className="min-w-full divide-y divide-gray-200 text-left">
//                 <thead className="bg-gray-50">
//                     <tr>
//                         <th className="px-4 py-2">No</th>
//                         <th className="px-4 py-2">User</th>
//                         {/* <th className="px-4 py-2">User ID</th> */}
//                         {/* <th className="px-4 py-2">Projects</th> */}
//                         <th className="px-4 py-2">Status</th>
//                         <th className="px-4 py-2">Action</th>
//                     </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-100">
//                     {filteredData.length > 0 ? (
//                         filteredData.map((item, index) => {
//                             const isActive = item.status === "active";

//                             return (
//                                 <tr key={item.id} className="hover:bg-gray-50 transition">
//                                     <td className="px-4 py-3">{index + 1}</td>
//                                     <td className="px-4 py-3 flex items-center gap-2">
//                                         {item.profileImg ? (
//                                             <img
//                                                 src={item.profileImg}
//                                                 alt={item.name}
//                                                 className="w-8 h-8 rounded-full object-cover"
//                                             />
//                                         ) : (
//                                             <div className="w-8 h-8 rounded-full bg-gray-300" />
//                                         )}
//                                         <div>
//                                             <div className="font-medium text-gray-800">{item.name}</div>
//                                             <div className="text-gray-400 text-sm">{item.email}</div>
//                                         </div>
//                                     </td>
//                                     {/* <td className="px-4 py-3">{item.userId}</td>
//                                 <td className="px-4 py-3">{item.projects}</td> */}
//                                     <td className="px-4 py-3">
//                                         <span
//                                             className={`px-3 py-1 rounded-full text-xs font-medium
//                         ${item.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}
//                       `}
//                                         >
//                                             {item.status}
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-3 text-center">
//                                         <div className="w-24 mx-auto">
//                                             <button
//                                                 onClick={() => onStatusChange(item.id)}
//                                                 className={`w-full py-1 rounded-full text-sm font-medium transition-all duration-200
//         ${isActive ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-green-100 text-green-600 hover:bg-green-200"}
//       `}
//                                             >
//                                                 {isActive ? "Block" : "Unblock"}
//                                             </button>
//                                         </div>
//                                     </td>


//                                 </tr>
//                             );
//                         })
//                     ) : (
//                         <tr>
//                             <td colSpan={6} className="text-center py-6 text-gray-400 italic">
//                                 No records found
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>

//             {/* Pagination */}
//             <div className="flex justify-center items-center gap-2 mt-4">
//                 <button className="px-3 py-1 bg-purple-100 rounded-full text-purple-600 hover:bg-purple-200">&larr;</button>
//                 {[1, 2, 3, 4, 5].map((num) => (
//                     <button
//                         key={num}
//                         className={`px-3 py-1 rounded-full text-sm font-medium ${num === 2 ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600 hover:bg-purple-200"}`}
//                     >
//                         {num < 10 ? `0${num}` : num}
//                     </button>
//                 ))}
//                 <button className="px-3 py-1 bg-purple-100 rounded-full text-purple-600 hover:bg-purple-200">&rarr;</button>
//             </div>
//         </div>
//     );
// };

// export default ReusableTable;
