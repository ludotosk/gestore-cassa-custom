<template>
  <div class="space-y-2 p-1">
    <h2 class="text-center">Inserimento dati</h2>
    <div class="bg-white rounded shadow p-1">
      <h3 class="m-1">Categoria</h3>
      <div class="flex flex-col space-y-1">
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Inserire una categoria"
        />
        <button class="bg-green-400 rounded w-20 h-8">Aggiungi</button>
      </div>
    </div>
    <div class="bg-white rounded shadow p-1">
      <h3 class="m-1">Iva</h3>
      <div class="flex flex-col space-y-1">
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Aliquota iva"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Descrizione iva"
        />
        <button class="bg-green-400 rounded px-1 h-8 w-20">Aggiungi</button>
      </div>
    </div>
    <div class="bg-white rounded shadow p-1">
      <h3 class="m-1">Reparto</h3>
      <div class="flex flex-col space-y-1">
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Numero reparto"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Descrizione reparto"
        />
        <button class="bg-green-400 rounded h-8 w-20">Aggiungi</button>
      </div>
    </div>
    <div class="bg-white rounded shadow p-1">
      <h3 class="m-1">Prodotto</h3>
      <div class="flex flex-col space-y-1">
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Descrizione"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Descrizione breve"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Data inserimento"
          v-model="Oggi"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Code"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Oem code"
        />
        <input
          class="
            h-8
            block
            rounded-md
            bg-gray-100
            border-transparent
            focus:border-gray-500
            focus:ring-0
            w-80
            hover:border-blue-300
            mx-1
          "
          placeholder="Costo acquisto"
        />
        <select
          class="rounded focus:border-gray-500 focus:bg-white focus:ring-0 w-80"
          v-model="selected"
        >
          <option value="">Reparto</option>
        </select>
        <select
          class="rounded focus:border-gray-500 focus:bg-white focus:ring-0 w-80"
          v-model="selected"
        >
          <option value="">Categoria</option>
        </select>
        <button class="bg-green-400 rounded h-8 w-20">Aggiungi</button>
      </div>
    </div>
  </div>
</template>

<script>
const data = new Date();

export default {
  data() {
    return { selected: "" };
  },
  computed: {
    Oggi: function () {
      var giorno = data.getDate();
      var month = data.getMonth() + 1;
      var fullYear = data.getFullYear();
      return giorno + "/" + month + "/" + fullYear;
    },
  },
};
</script>