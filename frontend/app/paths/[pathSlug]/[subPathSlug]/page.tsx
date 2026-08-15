export default function SubPathPage({ params }: { params: { pathSlug: string; subPathSlug: string } }) { return <main><h1>{params.pathSlug}: {params.subPathSlug}</h1></main>; }

