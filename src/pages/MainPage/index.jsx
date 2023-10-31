import { useEffect, useState } from "react";
import axios from "axios";
import PokeCard from "../../components/PokeCard";
import AutoComplete from "../../components/AutoComplete";

function MainPage() {
  // 모든 포켓몬 데이터를 가지고 있는 state
  const [allPokemons, setAllPokemons] = useState([]);
  // 실제로 리스트로 보여주는 포켓몬 데이터를 가지고 있는 state
  const [displayPokemons, setDisplayPokemons] = useState([]);
  // 한번에 보여주는 포켓몬 수
  const limitNum = 20;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;

  useEffect(() => {
    fetchPokeData();
  }, []);

  const filterDisplayedPokemonData = (allPokemons, displayPokemons = []) => {
    const limit = displayPokemons.length + limitNum;
    const arr = allPokemons.filter((_, index) => index + 1 <= limit);
    return arr;
  };

  const fetchPokeData = async () => {
    try {
      const res = await axios.get(url);
      setAllPokemons(res.data.results);
      setDisplayPokemons(filterDisplayedPokemonData(res.data.results));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <article className="pt-6">
      <header className="flex flex-col gap-2 w-full px-4 z-50"></header>
      <AutoComplete
        allPokemons={allPokemons}
        setDisplayPokemons={setDisplayPokemons}
      />
      <section className="pt-6 flex flex-col justify-content items-center overflow-auto z-0">
        <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
          {displayPokemons.length > 0 ? (
            displayPokemons.map(({ url, name }, index) => (
              <PokeCard key={url} url={url} name={name} />
            ))
          ) : (
            <h2 className="font-medium text-lg text-slate-900 mb-1">
              포켓몬이 없습니다.
            </h2>
          )}
        </div>
      </section>
      <div className="text-center">
        {allPokemons.length > displayPokemons.length &&
          displayPokemons.length !== 1 && (
            <button
              onClick={() => {
                setDisplayPokemons(
                  filterDisplayedPokemonData(allPokemons, displayPokemons)
                );
              }}
              className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
            >
              더보기
            </button>
          )}
      </div>
    </article>
  );
}

export default MainPage;
