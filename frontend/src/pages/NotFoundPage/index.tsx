import image from './images.png'
import { Link } from '@tanstack/react-router'

export default function NotFoundPage() {
  return (
    <div className="h-[calc(100vh-149px)] flex flex-col items-center justify-center bg-bg-placeholder">
      <div className="max-w-56 w-full aspect-ratio-[1/1]">
        <img
          src={image}
          alt="Not Found"
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-[#1E1E1E] text-2xl font-semibold mt-4 text-center">
        Siz izlayotgan sahifa topilmadi!
      </h2>

      <p className="text-[#757575] mt-2 text-center max-w-[350px]">
        Sahifa topilmadi, boshqa ma'lumotlarga qarab ko'ring!
      </p>

      <Link
        to="/"
        className="mt-3 px-5 py-2 bg-[#41A58D] text-white rounded-md block"
      >
        Bosh sahifa
      </Link>
    </div>
  )
}
