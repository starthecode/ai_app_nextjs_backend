'use client';
import { getallModels } from '@/action/aimodel.action';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type AiModelProps = {
  id: string;
  aiModelType: string;
  name: string;
  icon: string;
  defaultPrompt: string;
  createdAt: string;
  updatedAt: string;
};

const AiModel = () => {
  const [aiModelsData, setAiModelsData] = React.useState<AiModelProps[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getallModels();
        setAiModelsData(res);
      } catch (err) {
        setError('Failed to fetch AI generated data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (aiModelsData.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="relative block overflow-y-auto h-auto">
          <div className="w-full justify-end flex">
            <Link
              className="bg-violet-600 px-3 py-1 text-white rounded-3xl"
              href={'/ai-model/create'}
            >
              Add new
            </Link>
          </div>
          <div className="p-1.5 min-w-full inline-block mt-5">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 h-full overflow-scroll">
                <thead>
                  <tr>
                    {[
                      'ID',
                      'Type',
                      'Icon',
                      'Name',
                      'Prompt',
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
                  {aiModelsData &&
                    aiModelsData.map((item) => (
                      <tr key={item.id}>
                        <td
                          scope="row"
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800"
                        >
                          {item.id.substr(0, 5) + '...'}
                        </td>
                        <td scope="row" className="whitespace-nowrap">
                          <span className="px-3 py-1 rounded-3xl text-xs font-medium text-gray-800 uppercase bg-violet-300">
                            {item.aiModelType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          <Image
                            width={80}
                            height={80}
                            src={item.icon}
                            alt={`${item.name} icon`}
                            className="w-6 h-6"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {item.defaultPrompt.substring(0, 30)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {item?.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {item?.updatedAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <Link
                            href={{
                              pathname: '/ai-model/edit/',
                              query: { id: item.id, name: item.name },
                            }}
                            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiModel;
