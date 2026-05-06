<template>
  <div class="banner has-text-centered">
    This site contains archived materials maintained for reference or
    record-keeping purposes. Some materials may not meet current accessibility
    standards. To learn more or to request an accessible version of archived
    content, please visit:
    <a href="https://digital-accessibility.brown.edu/" target="_blank">
      Digital Accessibility at Brown University
    </a>
  </div>
</template>

<style>
.banner {
    background-color: darkred;
    color: white;
    text-align: center;
    vertical-align: middle;
    padding-block: 5px;
    font-size: 1.2rem;
}

.banner a {
  color: #ffff66;
  text-decoration: underline;
  font-weight: bold;
  transition: color 0.2s;
}

.banner a:hover,
.banner a:focus {
  color: #ffffff;
  outline: 2px solid #ffffff;
  border-radius: 2px;
}
</style>
