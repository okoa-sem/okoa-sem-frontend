'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setQuery } from '../slices/youtube.slice';
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button';

export const SearchBar = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const dispatch = useDispatch();

	const handleSearch = () => {
		dispatch(setQuery(searchTerm));
	};

	return (
		<div className="flex w-full max-w-sm items-center space-x-2">
			<Input
				type="text"
				placeholder="Search videos..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
			/>
			<Button onClick={handleSearch}>Search</Button>
		</div>
	);
};
