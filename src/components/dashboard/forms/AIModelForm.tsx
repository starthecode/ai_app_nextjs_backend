'use client';
import { createAiModel, updateAiModel } from '@/action/aimodel.action';
import { uploadFile } from '@/libs/upload';
import { AiModelFormParams } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AIModelForm = ({ data }: { data?: AiModelFormParams }) => {
  const router = useRouter();

  const isUpdateMode = !!data; // Determine if it's update mode
  const [formData, setFormData] = useState({
    name: data?.name || '',
    aiModelName: data?.aiModelName || '',
    aiModelType: data?.aiModelType || '',
    defaultPrompt: data?.defaultPrompt || '',
    icon: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, icon: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.loading('Please Wait...');

    try {
      let iconUrl: string | undefined = data?.icon || ''; // Use existing URL by default
      const bufferbyai: Buffer | null = null; // Initialize to null
      // Upload a new file if one was selected
      if (formData.icon) {
        const formDataObj = new FormData();
        formDataObj.append('icon', formData.icon);
        const fileResponse = await uploadFile(formDataObj, bufferbyai);
        if (typeof fileResponse === 'string' || fileResponse === undefined) {
          iconUrl = fileResponse; // Update with new URL
        }
      }

      const payload = {
        id: data?.id, // Include ID only if updating
        name: formData.name,
        aiModelName: formData.aiModelName,
        aiModelType: formData.aiModelType,
        defaultPrompt: formData.defaultPrompt,
        icon: iconUrl,
      };

      // Call the appropriate API based on the mode
      const res = isUpdateMode
        ? await updateAiModel(payload)
        : await createAiModel(payload);

      if (res?.id) {
        toast.dismiss();
        router.push('/ai-model');
        toast.success(
          isUpdateMode
            ? 'Model Updated Successfully!'
            : 'Model Created Successfully!'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.dismiss();
        toast.error(`Error: ${error.message || 'Something went wrong!'}`);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl bg-gray-800 p-10 rounded-lg shadow-lg space-y-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-200"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 w-full px-4 py-2 bg-gray-700 text-gray-200 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the model's name"
          required
        />
      </div>

      <div>
        <label
          htmlFor="aiModelName"
          className="block text-sm font-medium text-gray-200"
        >
          AI Model Name
        </label>
        <input
          type="text"
          id="aiModelName"
          name="aiModelName"
          value={formData.aiModelName}
          onChange={handleInputChange}
          className="mt-1 w-full px-4 py-2 bg-gray-700 text-gray-200 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the AI model name"
          required
        />
      </div>

      <div>
        <label
          htmlFor="aiModelType"
          className="block text-sm font-medium text-gray-200"
        >
          Model Type
        </label>
        <input
          type="text"
          id="aiModelType"
          name="aiModelType"
          value={formData.aiModelType}
          onChange={handleInputChange}
          className="mt-1 w-full px-4 py-2 bg-gray-700 text-gray-200 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter AI model type"
          required
        />
      </div>

      <div>
        <label
          htmlFor="icon"
          className="block text-sm font-medium text-gray-200"
        >
          Icon
        </label>
        <div className="mt-1 flex items-center justify-center w-full border-2 border-dashed border-gray-600 rounded-lg p-4">
          <input
            type="file"
            id="icon"
            name="icon"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="icon"
            className="cursor-pointer text-sm text-gray-400 hover:underline"
          >
            Click to add an asset or drag and drop one here
          </label>
        </div>
      </div>

      <div>
        <label
          htmlFor="defaultPrompt"
          className="block text-sm font-medium text-gray-200"
        >
          Default Prompt
        </label>
        <textarea
          id="defaultPrompt"
          name="defaultPrompt"
          value={formData.defaultPrompt}
          onChange={handleInputChange}
          className="mt-1 w-full px-4 py-2 bg-gray-700 text-gray-200 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the default prompt"
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition"
      >
        {isUpdateMode ? 'Update Model' : 'Create Model'}
      </button>
    </form>
  );
};

export default AIModelForm;
