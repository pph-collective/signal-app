<template>
  <!-- copied from the element inspector when highlighting the vega map, sizing
  changed slightly for readability (8.23980470128374 => 8), width/height viewbox changed
  to size of just the dot and translate set to center of that viewbox -->
  <svg width="20px" height="20px" viewBox="0 0 20 20">
    <g>
      <path
        transform="translate(10,10)"
        d="M8,0A8,8,0,1,1,-8,0A8,8,0,1,1,8,0"
        fill="red"
        fill-opacity="0.5"
        stroke="red"
        stroke-width="1.5"
      ></path>
    </g>
  </svg>
</template>
