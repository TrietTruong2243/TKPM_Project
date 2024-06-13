import React, { useEffect, useState } from 'react';
import { TableRow, TableCell } from '@mui/material';
import CenteredSpinner from '../../../components/centered_spinner';
import NovelSourceManager from '../../../data-manager/novel_source_manager';
import { useNavigate } from 'react-router-dom';

const ReadItems = ({ searchValue }) => {
    const [novels, setNovels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sourceData, setSourceData] = useState([]);
    const navigate = useNavigate();
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
                    const { novelImage, novelTitle, sourceSlug, novelStatus, chapterId, chapterTitle, chapterPosition } = storedItems[novelId];
                    const source = sourceData.find((value) => value.slug === sourceSlug);
                    return { novelId, novelImage, novelTitle, source, novelStatus, chapterId, chapterTitle, chapterPosition };
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

    const handleChapterClick = (novelId, chapterId, chapterPosition, sourceSlug) => {
        navigate(`/description/${novelId}/chapter`, {
            state: {
                chapterSlug: chapterId,
                chapterPosition: chapterPosition,
                sourceSlug: sourceSlug,
            },
        });
    };

    return (
        <>
            {novels.map(({ novelId, novelImage, novelTitle, source, novelStatus, chapterId, chapterTitle, chapterPosition }, index) => (
                <TableRow key={index}>
                    <TableCell><img style={{ width: '100px', height: '150px' }} src={novelImage} alt={novelTitle} /></TableCell>
                    <TableCell style={{ color: '#fff' }}>{novelTitle}</TableCell>
                    <TableCell>{source.name}</TableCell>
                    <TableCell>{novelStatus}</TableCell>
                    <TableCell>
                        <div
                            onClick={() => handleChapterClick(novelId, chapterId, chapterPosition, source.slug)}
                            style={{ color: '#fff', cursor: 'pointer' }}
                        >
                            {chapterTitle}
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
};

export default ReadItems;
