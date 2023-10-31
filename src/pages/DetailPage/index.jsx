import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loading } from '../../assets/Loading'

import { ArrowLeft } from '../../assets/ArrowLeft'
import {
	FaChevronLeft,
	FaChevronRight,
	FaRulerVertical,
	FaWeight,
} from 'react-icons/fa'
import Type from '../../components/Type'
import BaseStat from '../../components/BaseStat'
import DamageRelations from '../../components/DamageRelations'
const DetailPage = () => {
	const params = useParams()
	const [pokemon, setPokemon] = useState()
	const [isLoading, setIsLoading] = useState(true)

	const baseUrl = `https://pokeapi.co/api/v2/pokemon/`

	useEffect(() => {
		fetchPokemonData(params.id)
	}, [params])

	async function fetchPokemonData(pokemonId) {
		const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
		try {
			const { data: pokemonData } = await axios.get(url)

			if (pokemonData) {
				const { name, id, types, height, weight, stats, abilities } =
					pokemonData
				const nextAndPreviousPokemon = await getNextAndPreviousPokemon(
					id,
				)

				const DamageRelations = await Promise.all(
					types.map(async (idx) => {
						const type = await axios.get(idx.type.url)
						return type.data.damage_relations
					}),
				)
				const formattedPokemonData = {
					id,
					name,
					types: types.map((type) => type.type.name),
					weight: weight / 10,
					height: height / 10,
					previous: nextAndPreviousPokemon.previous,
					next: nextAndPreviousPokemon.next,
					abilities: formatPokemonAbilities(abilities),
					stats: formatPokemonStats(stats),
					DamageRelations,
				}
				setPokemon(formattedPokemonData)
				setIsLoading(false)
			}
		} catch (error) {
			console.error(error)
			setIsLoading(false)
		}
	}
	const formatPokemonAbilities = (abilities) => {
		return abilities
			.filter((_, idx) => idx <= 1)
			.map((obj) => obj.ability.name.replaceAll('-', ' '))
	}
	const formatPokemonStats = ([
		statHp,
		statATK,
		statDEP,
		statSATK,
		statSDEP,
		statSPD,
	]) => [
		{ name: 'Hit Points', baseStat: statHp.base_stat },
		{ name: 'Attack', baseStat: statATK.base_stat },
		{ name: 'Defense', baseStat: statDEP.base_stat },
		{ name: 'Special Attack', baseStat: statSATK.base_stat },
		{ name: 'Special Defense', baseStat: statSDEP.base_stat },
		{ name: 'Speed', baseStat: statSPD.base_stat },
	]
	async function getNextAndPreviousPokemon(id) {
		const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`
		const { data: pokemonData } = await axios.get(urlPokemon)
		const previousRes =
			pokemonData.previous && (await axios.get(pokemonData.previous))
		const nextRes = pokemonData.next && (await axios.get(pokemonData.next))
		return {
			previous: previousRes?.data?.results?.[0].name,
			next: nextRes?.data?.results?.[0].name,
		}
	}

	if (isLoading) {
		return (
			<div
				className={`absolute h-auto w-auto top-1/3 translate-x-1/2 left-1/2 z-50`}>
				<Loading
					className={`w-12 h-12 z-50 animate-spin text-slate-900`}
				/>
			</div>
		)
	}
	if (!isLoading && !pokemon) {
		return <div>Not Found</div>
	}

	const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`
	const bg = `bg-${pokemon?.types?.[0]}`
	const text = `text-${pokemon?.types?.[0]}`

	return (
		<>
			<article className="flex items-center gap-1 flex-col w-full">
				<div
					className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}>
					{pokemon.previous && (
						<Link
							className="absolute top-[40%] translate-y-1/2 z-50 left-1"
							to={`/pokemon/${pokemon.previous}`}>
							<FaChevronLeft className="w-5 h-8 p-1" />
						</Link>
					)}

					{pokemon.next && (
						<Link
							className="absolute top-[40%] translate-y-1/2 z-50 right-0"
							to={`/pokemon/${pokemon.next}`}>
							<FaChevronRight className="w-5 h-8 p-1" />
						</Link>
					)}

					<section className="w-full flex flex-col z-20 items-center justify-end relative h-full">
						<div className="absolute z-30 top-6 flex items-center w-full justify-between px-2">
							<div className="flex items-center gap-1">
								<Link to="/">
									<ArrowLeft className="w-6 h-8 text-zinc-200" />
								</Link>
								<h1 className="text-zinc-200 font-bold text-xl capitalize">
									{pokemon.name}
								</h1>
							</div>
							<div className="text-zinc-200 font-bold text-md">
								#{pokemon.id.toString().padStart(3, '00')}
							</div>
						</div>
						<div className="relative h-auto max-w-[15.5rem] z-20 mt-6 mb-16">
							<img
								src={img}
								width="100%"
								height="auto"
								loading="lazy"
								alt={pokemon.name}
								className={`object-contain h-full`}
							/>
						</div>
					</section>
					<section className="w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4">
						<div className="flex items-center justify-center gap-4">
							{pokemon.types.map((type) => (
								<Type key={type} type={type} />
							))}
						</div>
						<h2 className={`text-base font-semibold ${text}`}>
							정보
						</h2>
						<div className="flex w-full items-center justify-between max-w-[400px] text-center">
							<div className="w-full">
								<h4 className="text-[0.5rem] text-zinc-100">
									Weight
								</h4>
								<div className="flex mt-1 gap-2 justify-center items-center text-sm text-zinc-200">
									<FaWeight />
									{pokemon.weight}kg
								</div>
							</div>
							<div className="w-full">
								<h4 className="text-[0.5rem] text-zinc-100">
									Weight
								</h4>
								<div className="flex mt-1 gap-2 justify-center items-center text-sm text-zinc-200">
									<FaRulerVertical />
									{pokemon.height}m
								</div>
							</div>
							<div className="w-full">
								<h4 className="text-[0.5rem] text-zinc-100">
									Weight
								</h4>
								{pokemon.abilities.map((abilitiy) => (
									<div
										key={abilitiy}
										className="text-[0.5rem] text-zinc-100 capitalize">
										{abilitiy}
									</div>
								))}
							</div>
						</div>
						<h2 className={`text-base font-semibold ${text}`}>
							기본 능력치
						</h2>
						<div className="w-full">
							<table>
								<tbody>
									{pokemon.stats.map((stat) => (
										<BaseStat
											key={stat.name}
											valueStat={stat.baseStat}
											nameStat={stat.name}
											type={pokemon.types[0]}
										/>
									))}
								</tbody>
							</table>
						</div>
						{pokemon.DamageRelations && (
							<div className="w-10/12">
								<h2
									className={`text-base text-center font-semibold ${text}`}>
									<DamageRelations
										damages={pokemon.DamageRelations}
									/>
								</h2>
							</div>
						)}
					</section>
				</div>
			</article>
		</>
	)
}

export default DetailPage
