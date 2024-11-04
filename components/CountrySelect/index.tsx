import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl";

const CustomDropdown = ({ selectedOption, countries, onSelect }) => {

  const menuRef = useRef(null);
  const transCountry = useTranslations('country');

  const [selectedCountry, setSelectedCountry] = useState<any>({
    name: "",
    flgURL: "",
  })

  useEffect(() => {
    const selected = countries.find(item => item.name === selectedOption); // Find the selected country from
    if (selected) {
      setSelectedCountry(selected)
    }
  }, [selectedOption])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        document.getElementById("country-dropdown-menu").classList.add("hidden")
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [])

  const handleCountryChange = (country: any) => {
    setSelectedCountry(country) // Update the selected country state
    onSelect("com_country", country.name)
    document.getElementById("country-dropdown-menu").classList.toggle("hidden")
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => document.getElementById("country-dropdown-menu").classList.toggle("hidden")}
        aria-label="Toggle menu"
        className="border-[1px] border-[#767676] rounded-xl py-1.5 px-4 inline-flex items-center justify-between w-full"
      >
        {selectedCountry.name !== "" ? (
          <div className="flex items-center">
            <Image
              src={`/images/flags/${selectedCountry.flgURL}`}
              alt={selectedCountry.name}
              className="rounded-md"
              width={20}
              height={20}
            />
            <span className="ml-2">{`${transCountry(selectedCountry.name)}`}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Image
              src={`/images/flags/${countries[0].flgURL}`}
              alt={countries[0].name}
              className="rounded-md"
              width={20}
              height={20}
            />
            <span className="ml-2">{`${transCountry(countries[0].name)}`}</span>
          </div>
        )}
        <svg
          className="fill-current size-4 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707-.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>
      <ul
        id="country-dropdown-menu"
        className="absolute -top-60 hidden mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base z-10 overflow-auto focus:outline-none px-3"
      >
       {countries.map((country: any) => (
          <button
            type="button"
            key={country.name}
            onClick={() => handleCountryChange(country)}
            className="cursor-pointer hover:bg-blue-500 hover:text-white p-2 flex items-center w-full"
          >
            <div className="flex items-center">
              <Image
                src={`/images/flags/${country.flgURL}`}
                alt={country.name}
                className="mr-2 rounded-md"
                width={20}
                height={20}
              />
              <span className="ml-2">{`${transCountry(country.name)}`}</span>
            </div>
          </button>
        ))}
      </ul>
    </div>
  )
}

export default CustomDropdown
