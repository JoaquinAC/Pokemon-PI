const { Pokemon , Type} = require("../db");
const axios = require("axios")
const { Op } = require("sequelize")


//POST /pokemons
const createPokemon = async (name, image, hp, attack, defense, speed, height, weight, types) => {
    // Convertir los valores numéricos a enteros si son cadenas de texto
    const hpInt = typeof hp === 'string' ? parseInt(hp, 10) : hp;
    const attackInt = typeof attack === 'string' ? parseInt(attack, 10) : attack;
    const defenseInt = typeof defense === 'string' ? parseInt(defense, 10) : defense;
    const speedInt = typeof speed === 'string' ? parseInt(speed, 10) : speed;
    const heightInt = typeof height === 'string' ? parseInt(height, 10) : height;
    const weightInt = typeof weight === 'string' ? parseInt(weight, 10) : weight;
  
    const lowerCaseTypes = types.map((type) => type.toLowerCase());

    const newPokemon = await Pokemon.create({
      name,
      image,
      hp: hpInt,
      attack: attackInt,
      defense: defenseInt,
      speed: speedInt,
      height: heightInt,
      weight: weightInt
    });
  
    const foundTypes = await Type.findAll({ where: { name: lowerCaseTypes } });
  
    if (foundTypes.length !== types.length) {
      throw new Error('No se encontraron todos los tipos especificados.');
    }
  
    await newPokemon.setTypes(foundTypes);
  
    return newPokemon;
  };

// GET | /pokemons/:idPokemon
const getPokemonDetailAPI = async (id) => {
    try {
      // Realizar la solicitud HTTP al endpoint de la API de Pokémon
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  
      // Obtener los datos del Pokémon y sus tipos del cuerpo de la respuesta
      const { name, sprites, stats, types } = response.data;
  
      // Obtener los nombres de los tipos de Pokémon
      const typeNames = types.map((type) => type.type.name);
  
      const formattedStats = stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat
      }));


      const pokemonDetail = {
        id,
        name,
        image: sprites.front_default,
        stats: formattedStats,
        types: typeNames,
        origen: 'API'
      };
  
      return pokemonDetail;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del Pokémon.');
    }
};

const getPokemonDetailBD = async (id) => {
    try {
      // Buscar el Pokémon por su ID en la base de datos
      const pokemon = await Pokemon.findByPk(id, {
        include: [Type] // Incluir los datos del tipo de Pokémon
      });
  
      // Verificar si se encontró el Pokémon
      if (!pokemon) {
        return undefined
      }
  
      // Obtener los nombres de los tipos de Pokémon
      const typeNames = pokemon.Types.map((type) => type.name);
  
      // Crear un objeto con la estructura del modelo Pokémon
      const pokemonDetail = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed,
        height: pokemon.height,
        weight: pokemon.weight,
        types: typeNames,
        origen: 'BD',
      };
  
      return pokemonDetail;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del Pokémon desde la base de datos.');
    }
  };

const getPokemonDetailID = async (id) => {
    try {
      const apiResult = await getPokemonDetailAPI(id); 
      const dbResult = await getPokemonDetailBD(id); 
      
      let result = [];

      if (apiResult) {
        result.push(apiResult);
      }
  
      if (dbResult) {
        result.push(dbResult);
      }

      return result
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del Pokémon.');
    }
};
  
//  GET | /pokemons/name?="..."
  
const getPokemonDetailByNameAPI = async (name) => {
  try {
    const formattedName = name.toLowerCase();

    // Realizar la solicitud HTTP al endpoint de la API de Pokémon
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${formattedName}`);

    // Obtener los datos del Pokémon y sus tipos del cuerpo de la respuesta
    const { id, name: pokemonName, sprites, stats, types } = response.data;

    // Obtener los nombres de los tipos de Pokémon
    const typeNames = types.map((type) => type.type.name);

    const formattedStats = stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat
    }));

    const pokemonDetail = {
      id,
      name: pokemonName,
      image: sprites.front_default,
      stats: formattedStats,
      types: typeNames,
      origen: 'API'
    };

    return pokemonDetail;
  } catch (error) {
    // Verificar si el error es debido a que el Pokémon no fue encontrado en la API (código de estado 404)
    if (error.response && error.response.status === 404) {
      return null; // Retornar nulo para indicar que el Pokémon no se encontró en la API
    }

    console.error(error);
    throw new Error('Error al obtener el detalle del Pokémon desde la API.');
  }
};
  
const getPokemonDetailByNameBD = async (name) => {
    try {
      // Convertir el nombre a minúsculas para evitar errores de escritura
      const lowercaseName = name.toLowerCase();
  
      // Buscar el Pokémon por su nombre en la base de datos
      const pokemon = await Pokemon.findOne({
        where: { name: lowercaseName },
        include: [Type] // Incluir los datos del tipo de Pokémon
      });
  
      // Verificar si se encontró el Pokémon
      if (!pokemon) {
        return undefined
      }
  
      // Obtener los nombres de los tipos de Pokémon
      const typeNames = pokemon.Types.map((type) => type.name);
  
      // Crear un objeto con la estructura del modelo Pokémon
      const pokemonDetail = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed,
        height: pokemon.height,
        weight: pokemon.weight,
        types: typeNames,
        origen: 'BD',
      };
  
      return pokemonDetail;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del Pokémon desde la base de datos.');
    }
};

const getPokemonDetailName = async (name) => {
    try {
      const apiResult = await getPokemonDetailByNameAPI(name); 
      const dbResult = await getPokemonDetailByNameBD(name); 
      const result = [apiResult, dbResult]; 
  
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del Pokémon.');
    }
};

//GET | /pokemons

const getAllPokemonsAPI = async (page, pageSize) => {
  try {
    const pokemons = [];
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    
    // Consulta de todos los Pokémon con sus types
    const allPokemonsBD = await Pokemon.findAll({
      include: [Type] // Incluir los datos de la tabla Type
    });

    // Mapeo y construcción de la estructura deseada con origen: 'BD'
    const allPokemonsMapped = allPokemonsBD.map((pokemon) => {
      const typeNames = pokemon.Types.map((type) => type.name);

      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        hp: pokemon.hp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed,
        height: pokemon.height,
        weight: pokemon.weight,
        types: typeNames,
        origen: 'BD',
      };
    });

    // Consulta de los Pokémon desde el endpoint
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const { results } = response.data;

    // Mapeo y construcción de la estructura deseada con origen: 'API'
    const pokemonDetailsPromises = results.map(async (pokemon) => {
      const pokemonDetail = await getPokemonDetailByNameAPI(pokemon.name);
      return {
        ...pokemonDetail,
        origen: 'API',
      };
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    // Combinación de los resultados de la base de datos y el endpoint
    const mergedPokemons = [...allPokemonsMapped, ...pokemonDetails];

    pokemons.push(...mergedPokemons);

    return pokemons;
    
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener la lista de Pokémon desde la API.');
  }
};

// DELETE /pokemons/:id

// Función para eliminar un Pokémon por su ID
const deletePokemon = async (id) => {
    try {
      // Verificar si el Pokémon existe en la base de datos
      const pokemon = await Pokemon.findByPk(id);
    
      // Verificar si se encontró el Pokémon
      if (!pokemon) {
        throw new Error('No se encontró el Pokémon especificado.');
      }
    
      // Eliminar las relaciones de muchos a muchos con los tipos de Pokémon
      await pokemon.setTypes([]);
      // Eliminar el Pokémon de la base de datos
      await pokemon.destroy();
    
      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Error al eliminar el Pokémon de la base de datos.');
    }
  };


//PUT /pokemons/:id

// const updatedData = {
//   name: 'Nuevo Nombre',
//   level: 50,
//   types: ['Agua', 'Volador'] // Arreglo de tipos a asignar al Pokémon
// };


const updatePokemon = async (pokemonId, updatedData) => {
  try {
    // Buscar el Pokémon por su ID en la base de datos
    const pokemon = await Pokemon.findByPk(pokemonId, {
      include: [Type] // Incluir los datos del tipo de Pokémon
    });

    // Verificar si se encontró el Pokémon
    if (!pokemon) {
      throw new Error('No se encontró el Pokémon especificado.');
    }

    // Actualizar los campos del Pokémon según los datos proporcionados
    await pokemon.update(updatedData);

    // Si se proporcionaron tipos, actualizar la relación "muchos a muchos"
    if (updatedData.types) {
      // Obtener los IDs de los tipos proporcionados
      const typeIds = await Promise.all(
        updatedData.types.map(async (typeName) => {
          const type = await Type.findOne({ where: { name: typeName } });
          if (!type) {
            throw new Error(`No se encontró el tipo ${typeName}.`);
          }
          return type.id;
        })
      );

      // Actualizar la relación "muchos a muchos" entre Pokémon y tipos
      await pokemon.setTypes(typeIds);
    }

    // Obtener los nombres de los tipos de Pokémon actualizados
    const types = await pokemon.getTypes();
    const updatedTypeNames = types.map((type) => type.name);

    // Crear un objeto con los datos actualizados del Pokémon
    const updatedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      speed: pokemon.speed,
      height: pokemon.height,
      weight: pokemon.weight,
      types: updatedTypeNames
    };

    return updatedPokemon;
  } catch (error) {
    console.error(error);
    throw new Error('Error al actualizar el Pokémon en la base de datos.');
  }
};


  module.exports = {
    createPokemon,
    getPokemonDetailID,
    getPokemonDetailName,
    getAllPokemonsAPI,
    deletePokemon,
    updatePokemon
};