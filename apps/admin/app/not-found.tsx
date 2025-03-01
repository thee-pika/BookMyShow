import Link from 'next/link'

export default function NotFound() {
  return <div className='min-h-80 flex justify-center items-center'>
      <h1>Not found – 404!</h1>
      <div>
        <Link href="/"><p className='hover:underline'>Go back to <b>Home</b></p></Link>
      </div>
  </div>
}
