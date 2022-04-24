import { ImageList,ImageListItem, Box, Container, ImageListItemBar, IconButton } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

const PagesGallery = ({itemClick, items}) => {
    return (
        <Container style={{display:"flex", alignItems:'center', justifyContent:"center",flexGrow: 1, height:"80%"}}>
            <Box
              sx={{ boxShadow: 5, width:"80%", height:"80%"}}
              style={{ display: "flex", justifyContent: "center" }}
            >
        <ImageList
          sx={{ width: "90%", height: "90%" }}
          cols={2}
          rowHeight={164}
          gap={5}
        >
          {items.map((item, i) => (
            <ImageListItem
              key={i}
              style={{ border: "2px solid black", overflow:"clip"}, {transition: '0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                width: '500px'
              },}}
              onClick={()=>itemClick(item)}
            >
              <img
                src={item.img + "?w=164&h=164&fit=crop&auto=format"}
                srcSet={item.img + "?w=164&h=164&fit=crop&auto=format@dpr=2 x2"}
                alt={item.title}
                loading="lazy"
                width="100%"
                hight="100%"
              />
                        <ImageListItemBar
            title={item.title}
            subtitle={"subtitle"}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${item.title}`}
              >
                <InfoIcon />
              </IconButton>
            }
          />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
        </Container>
    );
  };



  export default PagesGallery