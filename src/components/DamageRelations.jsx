import React, { useEffect, useState } from 'react'

const DamageRelations = ({ damages }) => {
	const [damageForm, setDamageForm] = useState({})

	// API 가공 - from, to 나누기
	const split = (damage) => {
		const from = filterDamageRelations('_from', damage)
		const to = filterDamageRelations('_to', damage)
		return { from, to }
	}

	const filterDamageRelations = (valueFilter, damage) => {
		const result = Object.entries(damage)
			.filter(([keyName, value]) => {
				return keyName.includes(valueFilter)
			})
			.reduce((acc, [keyName, value]) => {
				const keyWithValueFilterRemove = keyName.replace(
					valueFilter,
					'',
				)
				return (acc = { [keyWithValueFilterRemove]: value, ...acc })
			}, {})
		return result
	}

	const joinDamageRelations = (props) => {
		return {
			to: joinObjects(props, 'to'),
			from: joinObjects(props, 'from'),
		}
	}
	const joinObjects = (props, string) => {
		const key = string
		const firstValueArray = props[0][key]
		const secondValueArray = props[1][key]

		const result = Object.entries(secondValueArray).reduce(
			(acc, [keyName, value]) => {
				const result = firstValueArray[keyName].concat(value)
				return (acc = {
					[keyName]: result,
					...acc,
				})
			},
			{},
		)
		return result
	}

	const reduceDuplicateValues = (props) => {
		const duplicateValues = {
			double_damage: '4x',
			half_damage: '1/4x',
			no_damage: '0x',
		}
		return Object.entries(props).reduce((acc, [keyName, value]) => {
			const key = keyName
			const verifiedValue = filterForUniqueValues(
				value,
				duplicateValues[key],
			)
			return (acc = {
				[keyName]: verifiedValue,
				...acc,
			})
		}, {})
	}
	const filterForUniqueValues = (valueForFiltering, damageValue) => {
		return valueForFiltering.reduce((acc, currentValue) => {
			const { url, name } = currentValue
			const filterAcc = acc.filter((a) => a.name !== name)
			return filterAcc.length === acc.length
				? (acc = [currentValue, ...acc])
				: (acc = [
						{ damageValue: damageValue, name, url },
						...filterAcc,
				  ])
		}, [])
	}
	const postDamageValue = (props) => {
		const result = Object.entries(props).reduce((acc, [keyName, value]) => {
			const key = keyName
			const valueOfKeyName = {
				double_damage: '2x',
				half_damage: '1/2x',
				no_damage: '0x',
			}
			return (acc = {
				[keyName]: value.map((i) => ({
					damageValue: valueOfKeyName[key],
					...i,
				})),
				...acc,
			})
		}, {})
		return result
	}

	useEffect(() => {
		const arrayDamage = damages.map((damage) => split(damage))
		if (arrayDamage.length === 2) {
			const obj = joinDamageRelations(arrayDamage)
			setDamageForm(reduceDuplicateValues(postDamageValue(obj.from)))
		} else {
			setDamageForm(postDamageValue(arrayDamage[0].from))
		}
	}, [damages])
	return <div></div>
}

export default DamageRelations
