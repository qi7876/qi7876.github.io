import { generateAtom } from '@/utils/feed'

export async function GET() {
  return generateAtom()
}
