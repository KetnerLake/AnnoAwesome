export default async ( req, ctx ) => {
  return new Response( 'You are awesome!' );
};

export const config = {
  path: '/api/hello',
  preferStatic: true
};
