'use client';

import { getallGen } from '@/action/aigen.action';
import Image from 'next/image';
import React from 'react';

type AiGenData = {
  id: string;
  userEmail: string;
  imageUrl: string;
  prompt: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

const AiGenImages = () => {
  const [aiGenData, setAiGenData] = React.useState<AiGenData[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getallGen();
        setAiGenData(res);
      } catch (err) {
        setError('Failed to fetch AI generated data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (aiGenData.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div className="p-1.5 min-w-full inline-block">
      <div className="overflow-scroll h-[600px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {[
                'ID',
                'User Email',
                'Generated Image',
                'Prompt',
                'Category',
                'Created At',
                'Updated At',
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {aiGenData.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {item.id.substring(0, 5)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {item.userEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Image
                    width={80}
                    height={80}
                    src={item.imageUrl}
                    alt="Generated content"
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <span className="w-[300px] flex break-words whitespace-normal">
                    {item.prompt}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {new Date(item.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AiGenImages;
