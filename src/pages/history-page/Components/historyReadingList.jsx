import React, { useEffect, useState } from 'react';
import { TableRow, TableCell } from '@mui/material';
import { GetNovelByIdService, GetChapterOfNovelContent } from '../../../service/service';
import CenteredSpinner from '../../../spinner/centered_spinner';

const ReadItems = ({ searchValue }) => {
    const [novels, setNovels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true); // Set loading to true when searchValue changes

        const storedItems = JSON.parse(localStorage.getItem('readItems')) || {};
        const fetchNovels = async () => {
            const novelDataArray = await Promise.all(
                Object.keys(storedItems).map(async (novelId) => {
                    const novel = await GetNovelByIdService(novelId);
                    const chapterId = storedItems[novelId];
                    const chapter = await GetChapterOfNovelContent(novelId, chapterId);
                    return { novelId, chapterId, novel, chapter };
                })
            );

            // Sort novels based on searchValue
            let sortedNovels = [...novelDataArray];
            switch (searchValue) {
                case 1:
                    setNovels([...sortedNovels].reverse());
                    break;
                case 2:
                    setNovels(sortedNovels);
                    break;
                case 3:
                    setNovels([...sortedNovels].sort((a, b) => a.novel.title.localeCompare(b.novel.title)));
                    break;
                case 4:
                    setNovels([...sortedNovels].sort((a, b) => b.novel.title.localeCompare(a.novel.title)));
                    break;
                default:
                    break;
            }
            setLoading(false);
        };

        fetchNovels();
    }, [searchValue]); // Run effect when searchValue changes

    if (loading) {
        return <CenteredSpinner />;
    }

    return (
        <>
            {novels.map(({ novelId, chapterId, novel, chapter }, index) => (
                <TableRow key={index}>
                    <TableCell><img style={{ width: '100px', height: '150px' }} src={novel.img} alt={novel.title} /></TableCell>
                    <TableCell style={{ color: '#fff' }}>{novel.title}</TableCell>
                    <TableCell>{novel.status}</TableCell>
                    <TableCell><a style={{ color: '#fff' }} href={`description/${novelId}/chapter/${chapterId}`}>{chapter.chapter}</a></TableCell>
                </TableRow>
            ))}
        </>
    );
};

export default ReadItems;
