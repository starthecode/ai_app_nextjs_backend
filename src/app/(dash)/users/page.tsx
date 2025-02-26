'use client';
import { getallUsers } from '@/action/user.action';
import Image from 'next/image';
import React from 'react';

type userProps = {
  id: string;
  email: string;
  picture: string;
};

const Users = () => {
  const [userData, setUserData] = React.useState<userProps[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getallUsers();

        setUserData(res);
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

  if (userData.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="-m-1.5">
          <div className="p-1.5 min-w-full inline-block">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {['ID', 'Email', 'User Photo'].map((header) => (
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
                  {userData &&
                    userData.map((item) => (
                      <tr key={item.id}>
                        <td
                          scope="row"
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800"
                        >
                          {item.id.substr(0, 5) + '...'}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 flex justify-start">
                          <Image
                            width={80}
                            height={80}
                            src={
                              `https://cdk-hnb659fds-assets-305383907906-us-west-1.s3.us-west-1.amazonaws.com` +
                              item.picture
                            }
                            alt={`${item.picture} icon`}
                            className="w-6 h-6"
                          />
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

export default Users;
