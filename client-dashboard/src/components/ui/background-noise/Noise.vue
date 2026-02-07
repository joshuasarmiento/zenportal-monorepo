<template>
    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" >
        <filter id="noise" x="0" y="0">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feBlend mode="screen"/>
        </filter>
        <rect class="w-full h-full" filter="url(#noise)" opacity="0.5"/>
    </svg>
</template>