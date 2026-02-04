export default function Navbar() {
  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold">SevaSync</h1>
      <button onClick={() => {
        localStorage.clear();
        window.location.href="/";
      }}>
        Logout
      </button>
    </div>
  );
}
