import Image from 'next/image';
import React, { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const ScrollableItems = ({ items, tooltips }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 3;

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, Math.ceil(items.length / itemsPerPage) - 1))
    };

    const startIndex = currentIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
    const visibleItems = items.slice(startIndex, endIndex);
    const visibleTooltips = tooltips.slice(startIndex, endIndex);

    return (
        <div className="flex">
            {items.length > itemsPerPage && (
                <button
                    type="button"
                    aria-label='icon_left'
                    onClick={handlePrev}
                    className="mr-2 rounded-full p-1 text-[#A536FA]"
                >
                    <FaAngleLeft />
                </button>
            )}
            {visibleItems.map((item, index) => (
                <div key={item.index} className="relative group size-8 mx-1">
                    <Image
                        src={item.item || "/images/logo_short_black.png"}
                        alt="bot_avatar"
                        width={100}
                        height={100}
                        className="object-cover rounded-full w-full h-full"
                    />
                    <span className="absolute z-[99] left-1/2 -translate-x-1/2 top-10 scale-0 rounded bg-gray-800 inline p-2 text-xs text-white group-hover:scale-100">{visibleTooltips ? visibleTooltips[index] : ''}</span>
                </div>
            ))}
            {items.length > itemsPerPage && (
                <button
                    type="button"
                    aria-label="Add"
                    onClick={handleNext}
                    className="ml-2 rounded-full p-1 text-[#A536FA]"
                >
                    <FaAngleRight />
                </button>
            )}
        </div>
    );
};

export default ScrollableItems;