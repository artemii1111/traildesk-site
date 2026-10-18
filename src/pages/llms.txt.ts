import { llms } from '../llms';

export const GET = () => new Response(llms(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
