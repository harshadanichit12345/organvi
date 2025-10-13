import React, { useEffect, useState } from "react";
import { client } from "../client";
import { allSpicesQuery } from "../groqQueries";

const SpicesList = () => {
  const [spices, setSpices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(allSpicesQuery)
      .then((data) => {
        setSpices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching spices:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {spices.map((item) => (
        <div key={item._id} className="bg-white shadow-lg rounded-xl p-4">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
          <h2 className="text-xl font-bold mt-3">{item.title}</h2>
          <p className="text-gray-600">{item.description}</p>
          <p className="text-green-700 font-semibold mt-2">₹{item.price}</p>
        </div>
      ))}
    </div>
  );
};

export default SpicesList;
