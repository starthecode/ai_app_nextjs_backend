'use client';
import { getsingleAiModel } from '@/action/aimodel.action';
import AIModelForm from '@/components/dashboard/forms/AIModelForm';
import { AiModelFormParams } from '@/types';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const params = useSearchParams();

  const id = params.get('id');

  const [data, setData] = useState<AiModelFormParams | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchData = async () => {
      try {
        const res = await getsingleAiModel(id); // Pass the `id` to fetch data

        console.log('res', res);

        setData(res);
      } catch (err) {
        setError('Failed to fetch AI model details.');
        console.error('Error fetching AI model:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!data) {
    return <div>No data found for the specified AI model.</div>;
  }

  return <AIModelForm data={data} />;
};

export default Page;
