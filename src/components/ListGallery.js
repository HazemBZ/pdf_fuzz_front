import { ImageList,ImageListItem } from "@mui/material";

const ListGallery = ({ items }) => {
  return (
    <ImageList sx={{width: 500}} cols={2}  rowHeight={180}>
      {itemData.map((item, i) => (
        <ImageListItem key={i}>
          <img src={item.img+"?w=164&h=164&fit=crop&auto=format"} 
          srcSet={item.img+"?w=164&h=164&fit=crop&auto=format@dpr=2 x2"} alt={item.title}  loading="lazy" />
        </ImageListItem>
      ))}
    </ImageList>
  );
};