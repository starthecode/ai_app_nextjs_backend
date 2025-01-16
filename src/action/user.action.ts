'use server';

import prisma from '@/libs/prismaDB';

export const getallUsers = async () => {
  try {
    const result = await prisma.user.findMany();

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error:', error);
  }
};

// export const getProducts = async (
//   postsPerPage: number,
//   categoryId: string,
//   page: any
// ) => {
//   try {
//     const [products, count] = await prisma.$transaction([
//       prisma.product.findMany({
//         where: {
//           categoryId,
//         },

//         skip: (page - 1) * postsPerPage,
//         take: postsPerPage,

//         orderBy: { createdAt: 'desc' },
//         select: {
//           id: true,
//           title: true,
//           imageUrl: true,
//           isFree: true,
//           price: true,
//           category: true,
//         },
//       }),
//       prisma.product.count({
//         where: {
//           categoryId,
//         },
//       }),
//     ]);

//     return {
//       pagination: {
//         total: count,
//       },
//       data: products,
//     };
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };

// export const getProductById = async (id: string) => {
//   try {
//     const product = await prisma.product.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         category: true,
//       },
//     });
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     return JSON.parse(JSON.stringify(product));
//   } catch (error) {
//     console.log(error);
//   }
// };
