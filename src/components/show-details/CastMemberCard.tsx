/**
 * CastMemberCard - Display cast member with hover effect to show character
 */

import { useState } from 'react';
import type { CastMember } from '@/types';

interface CastMemberCardProps {
    member: CastMember;
}

export function CastMemberCard({ member }: CastMemberCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const displayImage = isHovered
        ? member.character.image?.medium ||
          member.character.image?.original ||
          member.person.image?.medium ||
          member.person.image?.original
        : member.person.image?.medium || member.person.image?.original;

    return (
        <div
            className="text-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="mb-2 aspect-3/4 overflow-hidden rounded-lg bg-gray-800">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={
                            isHovered
                                ? member.character.name
                                : member.person.name
                        }
                        className="h-full w-full object-cover transition-opacity duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                        No image
                    </div>
                )}
            </div>
            <p
                className={`mb-0.5 text-xs text-white transition-all ${
                    isHovered ? 'font-normal' : 'font-semibold'
                }`}
            >
                {member.person.name}
            </p>
            <p
                className={`text-xs text-gray-400 transition-all ${
                    isHovered ? 'font-bold' : 'font-normal'
                }`}
            >
                {member.character.name}
            </p>
        </div>
    );
}
