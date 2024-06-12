import React, { useEffect, useState } from 'react';
import { TableRow, TableCell } from '@mui/material';
import CenteredSpinner from '../../../components/centered_spinner';
import NovelSourceManager from '../../../data-manager/novel_source_manager';

const ReadItems = ({ searchValue }) => {
    const [novels, setNovels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sourceData, setSourceData] = useState([]);

    let novelSourceManager = NovelSourceManager.getInstance();

    useEffect(() => {
        novelSourceManager.get().then(res => {
            setSourceData([...res]);
        });
    }, []);
    useEffect(() => {
        setLoading(true); // Set loading to true when searchValue changes

        const storedItems = JSON.parse(localStorage.getItem('readItems')) || {};
        const novelIds = Object.keys(storedItems);

        const fetchNovelData = async () => {
            const novelDataArray = await Promise.all(
                novelIds.map(async (novelId) => {
                    const {novelImage ,novelTitle, sourceSlug, novelStatus,chapterId,  chapterTitle} = storedItems[novelId]; 

                    console.log(storedItems[novelId])
                    // const novel = await GetNovelByIdService(novelId, sourceData);

                    const source = sourceData.find((value) => value.slug === sourceSlug);
                    // const chapter = await GetChapterOfNovelContent(novelId, chapterId, sourceSlug);
                    return { novelId, novelImage, novelTitle, source,novelStatus, chapterId,  chapterTitle };
                })
            );

            // Sort novels based on searchValue
            let sortedNovels = [...novelDataArray];
            switch (searchValue) {
                case 1:
                    sortedNovels.reverse();
                    break;
                case 3:
                    sortedNovels.sort((a, b) => a.novelTitle.localeCompare(b.novelTitle));
                    break;
                case 4:
                    sortedNovels.sort((a, b) => b.novelTitle.localeCompare(a.novelTitle));
                    break;
                default:
                    break;
            }
            setNovels(sortedNovels);
            setLoading(false);
        };

        if (sourceData.length > 0) {
            fetchNovelData();
        } else {
            setLoading(false);
        }
    }, [searchValue, sourceData]);

    if (loading) {
        return <CenteredSpinner />;
    }

    return (
        <>
            {novels.map(({ novelId, novelImage, novelTitle, source,novelStatus, chapterId,  chapterTitle }, index) => (
                <TableRow key={index}>
                    <TableCell><img style={{ width: '100px', height: '150px' }} src={novelImage} alt={novelTitle} /></TableCell>
                    <TableCell style={{ color: '#fff' }}>{novelTitle}</TableCell>
                    <TableCell>{source.name}</TableCell>
                    <TableCell>{novelStatus}</TableCell>
                    <TableCell><a style={{ color: '#fff' }} href={`description/${novelId}/chapter/${chapterId}?source=${source.slug}`}>{chapterTitle}</a></TableCell>
                </TableRow>
            )
        )}
        </>
    );
};

export default ReadItems;
