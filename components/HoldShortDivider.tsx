export default function HoldShortDivider() {
  return (
    <div className="w-full bg-jacLight py-8 flex justify-center items-center overflow-hidden border-t border-gray-100">
      <div className="w-full max-w-4xl px-4" id="hold-short-divider">
        <div className="flex flex-col gap-1.5 w-full">
          <div className="hs-solid" />
          <div className="hs-solid" />
          <div className="hs-dashed mt-1" />
          <div className="hs-dashed" />
        </div>
      </div>
    </div>
  )
}
