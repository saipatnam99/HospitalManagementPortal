

const Navbar = () => {
  return (
    // <div className="bg-slate-500 text-white py-3 px-4 mt-2 rounded-full items-right">
    //     <button className="bg-blue-700 text-white rounded-md p-2 "> Login</button>
    // </div>
    <div className="bg-slate-600 text-white p-4 flex justify-between items-center">
    <h1 className="text-2xl font-semibold">HOSPITAL</h1>
    <button
     
      className="bg-blue-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
    >
      Log Out
    </button>
  </div>
  )
}

export default Navbar